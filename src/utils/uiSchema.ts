import { UiSchema } from '@rjsf/utils'
import { Moon} from 'lucide-react'
const uiSchema: UiSchema = {
  'ui:globalOptions': {
    enableMarkdownInDescription: true,
    duplicateKeySuffixSeparator: '-'
  },
  'ui:submitButtonOptions': {
    submitText: 'Save',
    
    props: {
      className: 'font-bold dark:bg-green-600 dark:hover:bg-green-700 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded drop-shadow-md'
    }
  },
  'ui:options': {
    "semantic": {
      "fluid": true,
      "inverted": false,
      "errorOptions": {
        "size": "small",
        "pointing": "above"
      }
    },
    //props: {
      //className: 'dark:bg-gray-800 bg-gray-100 p-4 rounded drop-shadow-md mb-4 bg-opacity-50'
      
    //},
    
   // 'ui:field': {
     // props: {
       //   className: 'dark:bg-gray-800 bg-gray-100 p-4 rounded drop-shadow-md mb-4 bg-opacity-50',
    //  },
      
   // },
  },
  
paths: {
    "ui:options": {
      addable: true,
      addButtonText: "เพิ่ม endpoint"  // <-- ตรงนี้เปลี่ยนข้อความปุ่ม
    },
  'ui:description': 'Relative paths to the individual **endpoints.** They must be relative to the `basePath`'
  },
    tags: {
      "ui:options": {
      addable: true,
        deletable: false,
      addButtonText: "เพิ่ม endpoint"
    }
      }
}
const uiSchemaPaths: UiSchema = {
  'ui:additionalProperties': {
    
  }
}
export default uiSchema