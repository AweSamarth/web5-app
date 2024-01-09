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
  const [ age, setAge] = useState(0)
  const [profilePicture, setProfilePicture] = useState()
  const [theBase64, setTheBase64] = useState()
  const [registered, setRegistered] = useState(false)
  const [vc, setVc] = useState("")


  useEffect(()=>{


    async function vcGetter(){

     setVc(localStorage.getItem("vc"))

     if (localStorage.getItem("vc")){
      
     }
    }
    vcGetter()
  }, [vc])


  useEffect(() => {
    async function converter(){
      if (profilePicture){
      const base64 = await toBase64(profilePicture)
      setTheBase64(base64)
      }
    }
    if (profilePicture) {
      converter()
    }



  }, [profilePicture]);

  
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        
        resolve(fileReader.result);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

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
    const { record: profileRecord, status: profileStatus } = await web5.dwn.records.create({
        data: myDid,
        message: {
          schema: 'https://social-media.xyz/schemas/profileSchema',
          dataFormat: 'text/plain',
          protocol: protocolDefinition.protocol,
          protocolPath: 'profile'
        }
      });
      console.log(profileRecord.id)
      localStorage.setItem("doctorRecord", profileRecord.id)


      const { record: nameRecord, status: nameStatus } = await web5.dwn.records.create({
        data: firstName+" "+lastName,
        message: {
          parentId: profileRecord.id,
          contextId: profileRecord.id,
          schema: 'https://social-media.xyz/schemas/nameSchema',
          dataFormat: 'text/plain',
          protocol: protocolDefinition.protocol,
          protocolPath: 'profile/name'
        }
      });

      console.log(typeof(theBase64))
      const { record: pfpRecord, status: pfpStatus } = await web5.dwn.records.create({
        data: theBase64,
        message: {
          parentId: profileRecord.id,
          contextId: profileRecord.id,
          schema: 'https://social-media.xyz/schemas/pfpSchema',
          dataFormat: 'image/jpeg',
          protocol: protocolDefinition.protocol,
          protocolPath: 'profile/pfp'
        }
      });

      console.log(pfpStatus)

      console.log(pfpRecord)

      const { record: roleRecord, status: roleStatus } = await web5.dwn.records.create({
        data: "Doctor",
        message: {
          parentId: profileRecord.id,
          contextId: profileRecord.id,
          schema: 'https://social-media.xyz/schemas/roleSchema',
          dataFormat: 'text/plain',
          protocol: protocolDefinition.protocol,
          protocolPath: 'profile/role'
        }
      });


      

    //   console.log(createStatus)
      const { records: replies } = await web5.dwn.records.query({
        message: {
            filter: {
             
             parentId: profileRecord.id,
             contextId: profileRecord.id
              
            }
        }
    })

    await replies

    replies.map(async(e)=>{
      console.log(await e.data.text())
    })

    setRegistered(true)

  };

  const definitionChecker = async () => {
    const signedVcJwt = localStorage.getItem("vc");

    try {
      PresentationExchange.satisfiesPresentationDefinition({
        vcJwts: [signedVcJwt],
        presentationDefinition: presentationDefinition,
      });
      console.log("\nVC Satisfies Presentation Definition!\n");
    } catch (err) {
      console.log(
        "VC does not satisfy Presentation Definition: " + err.message
      );
    }

    // Create Presentation Result that contains a Verifiable Presentation and Presentation Submission
    const presentationResult =
      PresentationExchange.createPresentationFromCredentials({
        vcJwts: [signedVcJwt],
        presentationDefinition: presentationDefinition,
      });
    console.log("\nPresentation Result: " + JSON.stringify(presentationResult));

    try {
      await VerifiableCredential.verify({ vcJwt: signedVcJwt });
      console.log("\nVC Verification successful!\n");
    } catch (err) {
      console.log("\nVC Verification failed: " + err.message + "\n");
    }

    const parsedVC = VerifiableCredential.parseJwt({ vcJwt: signedVcJwt });
    console.log(parsedVC);

    if (parsedVC.vcDataModel.credentialSubject.DegreeName === "MBBS") {
      setVerified(true)
      creator()

    }




  };

  const presentationDefinition = {
    id: "presDefId123",
    name: "Medical Degree Presentation Verification",
    purpose: "for proving completion of a medical degree",
    input_descriptors: [
      {
        id: "legitness",
        purpose: "are you legit or not?",
        constraints: {
          fields: [
            {
              path: ["$.credentialSubject.DegreeName"],
            },
          ],
        },
      },
    ],
  };

  const definitionValidation = PresentationExchange.validateDefinition({
    presentationDefinition,
  });

  // console.log(definitionValidation);

  return (
    <div className="flex flex-col items-center px-4 py-3 gap-4">
      <div className=" text-4xl mb-7">Register as a Doctor here</div>
      {registered?(
        <div className="text-5xl text-center">You have successfully registered as a doctor!</div>

      ):(<div className=" flex flex-col">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">First Name</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={firstName}
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
            value={age==0?"":age}
            onChange={(event)=>setAge(event.target.value)
            
            }
          />
          <div className="label"></div>
          <div className="label">
            <span className="label-text">Profile Picture</span>
          </div>
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={(event)=>setProfilePicture(event.target.files[0])} />
  
          <div className="label"></div>
  
  
          <div className="label">
            <span className="label-text">Proof of Degree (JWT)</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            onChange={(event)=>setVc(event.target.value)}
            value={vc}
          />
          <div className="label"></div>
        </label>
  
        <button
          className="px-4 py-2 bg-blue-500 rounded self-center"
          onClick={definitionChecker}
        >
          Register
        </button>
        </div>)}


    </div>
  );
}
