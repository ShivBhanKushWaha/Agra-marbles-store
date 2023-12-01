interface NullDataProps{
    title: string;
}

const NullData:React.FC<NullDataProps> = ({title}) => {
    return (
        <div className="w-full h-[50vh] flex items-center flex-auto justify-center text-xl md:text-2xl xl:text-4xl">
            <p className="font-medium items-center m-6 p-3">{title}</p>
        </div>
    )
}

export default NullData;