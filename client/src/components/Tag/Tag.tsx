interface TagProps {
  label: string;
}

const Tag = ({ label }: TagProps) => {
  return <span className="text-xs p-1 bg-slate-200 rounded-md">{label}</span>;
};

export default Tag;
