import { useCallback, useState } from "react";

type Props = {
  label: string;
  accept?: string;
  onFiles: (files: File[]) => void;
};

export default function FileDrop({ label, accept, onFiles }: Props) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const accepted = Array.from(list).filter((file) =>
        accept ? file.name.toLowerCase().endsWith(accept) : true
      );
      setFiles(accepted);
      onFiles(accepted);
    },
    [accept, onFiles]
  );

  return (
    <div
      className="dropzone"
      style={{ borderColor: dragging ? "#0ea5e9" : undefined }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <h4>{label}</h4>
      <p>Drop XLSX here or pick a file.</p>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => handleFiles(e.target.files)}
        style={{ marginTop: 12 }}
      />
      {files.length ? (
        <div className="chips">
          {files.map((f) => (
            <span className="chip" key={f.name}>
              {f.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

