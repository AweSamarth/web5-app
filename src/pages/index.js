import Image from "next/image";

export default function Index(){


    return(
        <div className="bg-green-800 text-white h-screen flex-col flex gap-8 justify-center items-center overflow-hidden">
        <Image width={1350} height={0} src="/bg.jpg" className="z-0 absolute  brightness-[0.35]" />
        <div className="h-screen z-10 flex-col flex gap-8 justify-center items-center">

            <div className="  text-5xl">Welcome to Healthy5</div>
            <div className="flex gap-4">
            <a href="patient-registration"><button className="bg-blue-500 px-8 py-4 rounded-md">Patients</button></a>
                <a href="doctor-registration"><button className="bg-slate-100 text-black px-8 py-4 rounded-md">Doctors</button></a>

                <button></button>
            </div>
        </div>
        </div>
    )
}