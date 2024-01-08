import { Web5 } from "@web5/api";
import { useState, useEffect } from "react";
import { DidKeyMethod, DidDhtMethod, DidIonMethod } from "@web5/dids";
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { protocolDefinition } from "@/utils/constants";

export default function NewCredential() {
  const [issuerDid, setIssuerDid] = useState(null);
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const [verified, setVerified] = useState(false);
  const [ firstName , setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [ age, setAge] = useState()
  const [profilePicture, setProfilePicture] = useState()

  useEffect(() => {
    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import("@web5/api");

      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        const { protocol, status } = await web5.dwn.protocols.configure({
          message: {
            definition: protocolDefinition
          }
          
      });

      console.log(protocol)
      console.log(status)
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

  const creator = async () => {


    const { record: postRecord, status: createStatus } = await web5.dwn.records.create({
        data: myDid,
        message: {
          schema: 'https://social-media.xyz/schemas/profileSchema',
          dataFormat: 'text/plain',
          protocol: protocolDefinition.protocol,
          protocolPath: 'profile'
        }
      });

      console.log(postRecord)
      console.log(createStatus)
      const { records: replies } = await web5.dwn.records.query({
        message: {
            filter: {
             
             recordId: postRecord.id
            }
        }
    })

    console.log(await replies[0].data.text())
  };



  return (
    <div className="flex flex-col items-center px-4 py-3 gap-4">
      <div className=" text-4xl">Register as a Patient here</div>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">First Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          value = {firstName}
          onChange={(event)=>setFirstName(event.target.value)}
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Last Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          value = {lastName}
          onChange = {(event)=>setLastName(event.target.value)}
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Age</span>
        </div>
        <input
          type="number"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs text-white  "
          onChange={(event)=>setAge(event.target.value)}
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Profile Picture</span>
        </div>
        <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={(event)=>setFile(event.target.files[0])} />

        <div className="label"></div>

      </label>

      <button
        className="px-4 py-2 bg-blue-500 rounded"
        onClick={creator}
      >
        Register
      </button>

      <div>{verified ? verified : "he"}</div>
    </div>
  );
}
