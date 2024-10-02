import { v4 as uuidv4 } from "uuid";
import { StorageClient} from "@supabase/storage-js";

type UploadProps = {
  storage: StorageClient
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, storage, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    return { imageUrl: "", error: error.message };
  }

  const imageUrl = `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path
    }`;

  return { imageUrl, error: "" };
};

// export const deleteImage = async (imageUrl: string) => {
//   const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
//   const firstSlashIndex = bucketAndPathString.indexOf("/");
//   const bucket = bucketAndPathString.slice(0, firstSlashIndex);
//   const path = bucketAndPathString.slice(firstSlashIndex + 1);
//   const storage = getStorage(fromServer ?? false);

//   const { data, error } = await storage.from(bucket).remove([path]);

//   return { data, error };
// };