import { getAliyunKeyApi, insertFileApi } from "@/service/file";
import { Message } from "@arco-design/web-vue";

export interface UploadImageResponse {
  name: string;
  size: string;
  url: string;
  blob: Blob;
}

export const uploadImage = (
  options: {
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<UploadImageResponse> => {
  const { quality = 0.8, mimeType = "image/webp" } = options;

  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Require browser environment"));
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    const processImage = (file: File): Promise<UploadImageResponse> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const objectURL = URL.createObjectURL(file);

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas init failed");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(objectURL);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Compression failed"));
                  return;
                }
                resolve({ name: file.name, size: blob.size.toString(), url: URL.createObjectURL(blob), blob: blob });
              },
              mimeType,
              quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectURL);
          reject(new Error("Image load failed"));
        };

        img.src = objectURL;
      });
    };

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Invalid image file");
        }

        const result = await processImage(file);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(input);
      }
    };

    document.body.appendChild(input);
    input.click();
  });
};

export interface UploadToAliyunResponse {
  url: string;
  fileName: string;
  fileSize: string;
}

export function uploadToAliyun(blob: Blob, fileName: string, fileSize: string): Promise<UploadToAliyunResponse> {
  return new Promise((resolve, reject) => {
    getAliyunKeyApi()
      .then(async (res) => {
        try {
          const aliyunKey = res.data;
          const formData = new FormData();

          // 生成唯一文件名（保留原始后缀）
          const fileExt = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
          const uniqueName = `sl_${Date.now()}_${Math.random().toString(36).slice(2)}${fileExt}`;

          // 构造表单数据
          formData.append("key", `${aliyunKey.dir}${uniqueName}`);
          formData.append("OSSAccessKeyId", aliyunKey.accessid);
          formData.append("policy", aliyunKey.policy);
          formData.append("Signature", aliyunKey.signature);
          formData.append("file", blob, uniqueName);

          // 执行上传
          const response = await fetch(aliyunKey.host, {
            method: "POST",
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OSS响应错误: ${errorText}`);
          }

          // 获取完整文件路径
          const allFilePath = `${aliyunKey.host}/${aliyunKey.dir}${uniqueName}`;

          // 调用插入记录接口
          await insertFileApi({
            fileName,
            fileSize,
            fileMapName: allFilePath
          });

          // 返回标准化结果
          resolve({
            url: allFilePath,
            fileName,
            fileSize
          });
        } catch (error) {
          Message.error("文件上传流程失败");
          reject(error);
        }
      })
      .catch(reject); // 捕获获取凭证失败的错误
  });
}
