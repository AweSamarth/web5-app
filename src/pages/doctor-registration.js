import { Web5 } from "@web5/api";
import { useState, useEffect } from "react";
import { DidKeyMethod, DidDhtMethod, DidIonMethod } from "@web5/dids";
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";

export default function NewCredential() {
  const [issuerDid, setIssuerDid] = useState(null);
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import("@web5/api");

      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
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
      console.log('\nVC Verification successful!\n');
    } catch (err) {
      console.log('\nVC Verification failed: ' + err.message + '\n');
    }

    const parsedVC = VerifiableCredential.parseJwt( { vcJwt: signedVcJwt });
    console.log(parsedVC)

    if(parsedVC.vcDataModel.credentialSubject.DegreeName==="MBBS"){
      setVerified(true)
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

  console.log(definitionValidation);

  return (
    <div className="flex flex-col items-center px-4 py-3 gap-4">
      <div className=" text-4xl">Register as a Doctor here</div>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">First Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Last Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Age</span>
        </div>
        <input
          type="number"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs text-white  "
        />
        <div className="label"></div>
        <div className="label">
          <span className="label-text">Proof of Degree (JWT)</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>

      <button
        className="px-4 py-2 bg-blue-500 rounded"
        onClick={definitionChecker}
      >
        Issue
      </button>

      <div>{verified?verified:"he"}</div>
    </div>
  );
}
