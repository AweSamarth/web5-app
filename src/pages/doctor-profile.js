"use client";
import { Web5 } from "@web5/api";
import { useEffect, useState } from "react";
import { protocolDefinition } from "@/utils/constants";


export default function PatientProfile() {
  const [parentId, setParentId] = useState();
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const [name, setName] = useState()
  const [pfp, setPfp] = useState()


  useEffect(()=>{
    console.log(pfp)
  }, [pfp])

  useEffect(() => {

    async function doctorGetter() {
      setParentId(localStorage.getItem("doctorRecord"));
    
      if (localStorage.getItem("doctorRecord")&&web5){
        const { records: replies } = await web5.dwn.records.query({
            message: {
              filter: {
                parentId: parentId,
                contextId: parentId,
              },
            },
          });

          await replies;

          setName(await replies[0].data.text())
          const something = await replies[1].data.text()
          console.log(something)
          setPfp(something)
    

      }




    }

    doctorGetter()

    console.log(parentId);
  }, [parentId, web5]);

 
  useEffect(() => {
    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import("@web5/api");

      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        const { protocol, status } = await web5.dwn.protocols.configure({
          message: {
            definition: protocolDefinition,
          },
        });

        console.log(protocol);
        console.log(status);
        // await protocol.send(did);

        setWeb5(web5);
        setMyDid(did);
        console.log(web5);
        if (web5 && did) {
          console.log("Web5 initialized");
          // await configureProtocol(web5, did);
        }
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    };

    initWeb5();
  }, []);


  return (
    <div className="text-white flex flex-col min-h-screen justify-center items-center">
      <div className=" w-[40rem] text-xl h-[25rem] bg-green-800 rounded-md flex   flex-col justify-center text-center gap-5">
        <img
            className=" self-center object-contain rounded-md"
          src={pfp}  
          height={150}   
          width={350}  
           />
        <div>{name?name:""}</div>
        <div>Doctor</div>
        <div className=" text-lg pr-4 text-right">Healthy5</div>
      </div>
    </div>
  );
}
