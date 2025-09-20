import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMedia } from '@/hooks/useMediaQuery'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from 'lucide-react'
const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
];

const LanguageSwitcherDrawer: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useMedia()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false); // ปิด drawer หลังเลือกภาษา
  };
if (isMobile){
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="lg">
          <Languages className="size-4" /> {languages.find((l) => l.code === i18n.language)?.label ?? "Language"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" text-white">
        <DrawerHeader>
          <DrawerTitle>Select Language</DrawerTitle>
          <DrawerDescription>Choose your preferred language</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-2 p-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? "default" : "outline"}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center justify-center gap-2"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg">
          <Languages className="size-4" /> {languages.find((l) => l.code === i18n.language)?.label ?? "Language"}
        </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-slate-700 " >
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => {
      return (
        <DropdownMenuItem
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          
          >            <span>{lang.flag}</span>
          <span>{lang.label}</span></DropdownMenuItem>
      )
        })}
        
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcherDrawer;