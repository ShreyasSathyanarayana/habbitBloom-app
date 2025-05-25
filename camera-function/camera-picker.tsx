import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime"; // Install using: npm install mime
import { supabase } from "@/utils/SupaLegend";
import { getUserId } from "@/utils/persist-storage";

export const pickImage =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      console.log("Image picked:", JSON.stringify(result.assets[0],null,2));
      
      return result.assets[0]; // Single image asset
    }
    
    return null;
  };

export const takePhoto =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      console.warn("Camera permission denied");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0]; // Single captured image
    }

    return null;
  };

export const uploadProfileImage = async (image: { uri: string }) => {
  const userId = await getUserId(); // your logic to get authenticated user's ID
  const uri = image.uri;
  const fileExt = uri.split(".").pop();
  const contentType = mime.getType(uri) || "image/jpeg";

  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`; // <-- upload into folder named after userId

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const newFormData = new FormData();
  newFormData.append("file", {
    uri: uri,
    name: fileName,
    type: contentType,
  });

  // Convert base64 to Uint8Array
  // const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const { error } = await supabase.storage
    .from("avatars") // your bucket name
    .upload(filePath,newFormData);

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
};
