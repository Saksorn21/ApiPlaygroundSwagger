import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface TextareaMarkdownProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  value: string
  onChange: (value: string) => void
  theme: 'dark' | 'light'
  className?: string
  
}

const TextareaMarkdown: React.FC<TextareaMarkdownProps> = ({value, onChange, theme, className, ...props }) => {
  const { t } = useTranslation()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [markdown, setMarkdown] = useState<string>(value)
  useEffect(() => {
    setMarkdown(value)
  })
  return (
    <div className={cn('relative', className)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <SimpleMDE
        id="markdown-editor"
        value={markdown}
        onChange={(value: string) => {
          setMarkdown(value)
        }}
        options={
          
        }
  )
}
