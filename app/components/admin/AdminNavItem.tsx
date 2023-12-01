import { IconType } from "react-icons";

interface AdminNavItemProps{
    seleted?: boolean;
    icon: IconType;
    label: string
}

const AdminNavItem : React.FC<AdminNavItemProps> = ({
    seleted,
    icon:Icon,
    label
}) => {
  return (
    <div className={`flex items-center justify-center text-clip gap-1 p-2
    border-b-2 hover:text-slate-800 transition cursor-pointer
    ${seleted ? 'border-b-slate-800 text-slate-800' : 'text-slate-500 border-transparent'}`}>
        <Icon size={20}/>
        <div className="font-medium text-sm text-center break-normal">
            {label}
        </div>
    </div>
  )
}

export default AdminNavItem;