import { supabase } from '../supabaseClient';

/**
 * Deletes a file from Supabase Storage given its public URL.
 *
 * @param {string} url - The public URL of the file.
 * @param {string} bucketName - The name of the storage bucket (default: 'documents').
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const deleteFileFromUrl = async (url, bucketName = 'documents') => {
  if (!url) return { success: true };

  try {
    // Extract the path from the URL.
    // URL format: .../storage/v1/object/public/<bucketName>/<path>
    const urlParts = url.split(`/public/${bucketName}/`);

    if (urlParts.length > 1) {
      const filePath = decodeURIComponent(urlParts[1]);
      const { error } = await supabase.storage.from(bucketName).remove([filePath]);

      if (error) {
        console.error("Failed to delete file from storage:", error);
        return { success: false, error };
      }
      return { success: true };
    }

    return { success: false, error: "Invalid URL format" };
  } catch (err) {
    console.error("Error in deleteFileFromUrl:", err);
    return { success: false, error: err };
  }
};
