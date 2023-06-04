import { useState } from 'react'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

function useCopyToClipboard(): [CopyFn, CopiedValue] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
          
      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
          
      document.body.prepend(textArea);
      textArea.select();

      try {
          document.execCommand('copy');
      } catch (error) {
          console.error(error);
      } finally {
          textArea.remove();
      }
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copy, copiedText]
}

export default useCopyToClipboard;