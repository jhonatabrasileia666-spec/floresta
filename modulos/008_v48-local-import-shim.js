
window.FLORESTA_MODULES={
  three:"three",
  FBXLoader:"FBXLoader",
  SkeletonUtils:"SkeletonUtils"
};
window.__LOCAL_IMPORT=async function(name){
  if(name==="three" || name===window.FLORESTA_MODULES.three) return window.__THREE_MODULE;
  if(name==="FBXLoader" || name===window.FLORESTA_MODULES.FBXLoader) return window.__FBX_MODULE;
  if(name==="SkeletonUtils" || name===window.FLORESTA_MODULES.SkeletonUtils) return window.__SKELETON_MODULE;
  throw new Error("Módulo local desconhecido: "+String(name));
};
