import { createContext, useState } from "react";

const CreateContext = createContext(null);

export const CreateProvider = ({ children }) => {
  const [selectedFileType, setSelectedFileType] = useState("image");
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [selectedFileThumbnail, setSelectedFileThumbnail] = useState("");
  return (
    <CreateContext.Provider
      value={{
        selectedFileType,
        setSelectedFileType,
        selectedFilePath,
        setSelectedFilePath,
        selectedFileThumbnail,
        setSelectedFileThumbnail,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export default CreateContext;
