
// กำหนด type ของ props ที่จะส่งเข้ามา

export const formatMethod = (method: string) => {
  const colors: Record<string, string> = {
    get: "text-blue-600",
    post: "text-green-600",
    put: "text-yellow-600",
    delete: "text-red-600",
  };
  const colorClass = colors[method.toLowerCase()] || "";

  // ไฟล์ .tsx ทำให้คุณสามารถ return JSX ได้เลย
  return (
    <span className={`font-bold ${colorClass}`}>
      {method.toUpperCase()}
    </span>
  );
};
