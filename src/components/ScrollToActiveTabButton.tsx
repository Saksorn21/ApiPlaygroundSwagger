import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface ScrollToActiveTabButtonProps {
  activeTabId: string;
  showAfter?: number; // px เลื่อนลงมาแล้วจะโชว์ปุ่ม
}

export default function ScrollToActiveTabButton({
  activeTabId,
  showAfter = 200
}: ScrollToActiveTabButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > showAfter);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollToTab = () => {
    const target = document.getElementById(activeTabId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToTab}
      className={`
        fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg
        transition-all duration-300 ease-in-out transform z-50
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        hover:bg-blue-700
      `}
      aria-label="Scroll to active tab"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}