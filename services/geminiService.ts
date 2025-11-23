import { GoogleGenAI, Type } from "@google/genai";
import { PromptSettings, MediaType, RefinedResult, AspectRatio } from '../types';

// Initialize Gemini Client
// Use process.env.API_KEY directly as per guidelines
const getAiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Refines a raw idea into a professional prompt using Gemini Flash.
 */
export const refinePrompt = async (settings: PromptSettings): Promise<RefinedResult> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    Bạn là một chuyên gia kỹ sư Prompt (Prompt Engineer) hàng đầu thế giới về Generative AI (Midjourney, Stable Diffusion, DALL-E, Veo).
    Nhiệm vụ của bạn là biến những ý tưởng thô sơ thành các prompt tiếng Anh cực kỳ chi tiết, chuyên nghiệp và hiệu quả.
    
    Hãy phân tích ý tưởng và cấu trúc lại theo format chuyên sâu:
    1. **Subject**: Mô tả cực kỳ chi tiết chủ thể chính (trang phục, biểu cảm, tư thế, chất liệu, giải phẫu).
    2. **Environment**: Bối cảnh, nền, không gian, độ sâu trường ảnh (depth of field, bokeh).
    3. **Lighting & Atmosphere**: Ánh sáng (volumetric, rim light, cinematic lighting, natural light), tâm trạng, khói, sương mù, thời gian trong ngày.
    4. **Style & Medium**: 
       - Phong cách nghệ thuật cụ thể (ví dụ: Cyberpunk, Baroque, Ukiyo-e, Bauhaus).
       - Tác giả/Nghệ sĩ ảnh hưởng (ví dụ: Greg Rutkowski, Alphonse Mucha, Wes Anderson style, Roger Deakins cinematography) nếu phù hợp.
       - Công cụ/Chất liệu (Unreal Engine 5, Octane Render, Oil painting, Charcoal).
    5. **Camera & Technical**: 
       - Góc máy (Low angle, High angle, Dutch angle, Eye-level, Bird's-eye view). Chú ý sử dụng góc máy mà người dùng yêu cầu.
       - Loại ống kính & Tiêu cự (Wide angle 14mm, Telephoto 85mm, Macro 100mm, Fish-eye).
       - Thông số kỹ thuật (8k, 4k, highly detailed, photorealistic, ray tracing, HDR).
       - Bố cục (Rule of thirds, Golden ratio, Symmetrical).

    **Negative Prompt Strategy (Context-Aware):**
    Hãy tạo Negative Prompt thông minh và cụ thể dựa trên Style và Media Type được yêu cầu:
    - **Đối với Style Photorealistic/Cinematic**: Phải tránh 'cartoon, illustration, 3d render, painting, anime, sketch, drawing, cel shading, vector art, graphic design, 2d'.
    - **Đối với Style Anime/Digital Art/Oil Painting**: Phải tránh 'photorealistic, realism, photo, live action, 35mm photograph, 4k video'.
    - **Đối với Media Type VIDEO**: Cực kỳ quan trọng phải thêm 'static, still image, motionless, frozen, distorted motion, morphing, jittery, blurry motion, low fps'.
    - **Lỗi chung (Luôn bao gồm)**: 'bad anatomy, extra fingers, missing limbs, floating limbs, disconnected limbs, text, watermark, signature, username, low quality, jpeg artifacts, ugly, deformed, noisy, mutation'.

    Output phải là JSON với cấu trúc:
    {
      "title": "Tiêu đề ngắn gọn cho prompt",
      "prompt": "Nội dung prompt tiếng Anh hoàn chỉnh. Kết hợp tất cả các yếu tố trên thành một đoạn văn mô tả trôi chảy (narrative) hoặc danh sách từ khóa tối ưu tùy theo Style. BẮT BUỘC phải bao gồm các từ khóa về Camera (Angle, Lens) và Style Reference.",
      "negativePrompt": "Chuỗi negative prompt tiếng Anh đã được tối ưu hóa nghiêm ngặt theo chiến lược Context-Aware ở trên.",
      "explanation": "Giải thích ngắn gọn bằng tiếng Việt lý do chọn các thông số camera (góc máy, tiêu cự) và phong cách nghệ thuật cụ thể đó để đạt hiệu quả thị giác tốt nhất."
    }
  `;

  const userContent = `
    Input Data:
    - Raw Idea: "${settings.rawIdea}"
    - Target Media: ${settings.mediaType}
    - Style: ${settings.style}
    - Sub-Style/Influence: ${settings.subStyle || 'None'}
    - Camera Angle: ${settings.cameraAngle}
    - Lighting: ${settings.lighting || 'Auto'}
    - Mood: ${settings.mood || 'Auto'}
    - Aspect Ratio: ${settings.aspectRatio}
    - Custom Negative: ${settings.negativePrompt || 'None'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: userContent }] }], // Use explicit structure
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                prompt: { type: Type.STRING },
                negativePrompt: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            // propertyOrdering helps the model structure the JSON output more reliably
            propertyOrdering: ["title", "prompt", "negativePrompt", "explanation"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as RefinedResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error refining prompt:", error);
    throw error;
  }
};

/**
 * Generates an image preview using Gemini.
 */
export const generateImagePreview = async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = getAiClient();
    
    // Ensure aspectRatio is one of the supported strings: "1:1", "3:4", "4:3", "9:16", "16:9"
    // The enum in types.ts matches these values perfectly.
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Fast generation for preview
            contents: [{ parts: [{ text: prompt }] }],
            config: {
               imageConfig: {
                   aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9"
               }
            }
        });

        // Loop to find image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated.");
    } catch (error) {
        console.error("Image gen error:", error);
        throw error;
    }
};

/**
 * Generates a video preview using Veo.
 * IMPORTANT: This typically requires a paid key via window.aistudio
 */
export const generateVideoPreview = async (prompt: string, aspectRatio: string): Promise<string> => {
    // Determine Veo aspect ratio (supports 16:9 or 9:16)
    let veoRatio = '16:9';
    if (aspectRatio === AspectRatio.PORTRAIT || aspectRatio === AspectRatio.VERTICAL) {
        veoRatio = '9:16';
    } else {
        veoRatio = '16:9'; // Default for 1:1, 4:3, 16:9
    }

    const ai = getAiClient();

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: veoRatio as "16:9" | "9:16"
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("Video generation failed to return a URI");

        // The process.env.API_KEY here contains the user-selected key injected by the environment
        const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        if (!videoRes.ok) throw new Error("Failed to download video bytes");
        
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Video gen error:", error);
        throw error;
    }
}