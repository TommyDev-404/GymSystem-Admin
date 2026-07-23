
export const getYoutubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
}

export const parseYouTubeId=(value:string)=>{
   try{
      const url=new URL(value);
      return url.hostname.includes("youtu")
         ? url.searchParams.get("v") || ""
         :value;
   }catch{
      return value;
   }
};

export const ytThumb=(id:string)=>
   id
   ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
   : "";
