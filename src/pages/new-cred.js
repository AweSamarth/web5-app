import { Web5 } from "@web5/api";
import { useState, useEffect } from "react";
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidKeyMethod, DidDhtMethod, DidIonMethod } from "@web5/dids";

export default function NewCredential() {
  const [issuerDid, setIssuerDid] = useState(null);

useEffect(() => {

    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import('@web5/api');

      try {
        const { web5, did } = await Web5.connect({sync: '5s'});
        setWeb5(web5);
        setMyDid(did);
        console.log(web5);
        if (web5 && did) {
          console.log('Web5 initialized');
          // await configureProtocol(web5, did);
        }
      } catch (error) {
        console.error('Error initializing Web5:', error);
      }
    };

    initWeb5();

}, []);

  const issueCredential = async () => {
    const issuer = await DidKeyMethod.create();
    const issuee = await DidKeyMethod.create();

    const vc = await VerifiableCredential.create({
      type: "AcademicCredential",
      issuer: issuer.did,
      subject: issuee.did,
      expirationDate: "2100-09-30T12:34:56Z",
      data: {
        DegreeName: "MBBS",
        completionDate: new Date().toISOString(),
      },
    });

    const vc_jwt_employment = await vc.sign({ did: issuer });

    console.log(vc_jwt_employment);
    localStorage.setItem("vc", vc_jwt_employment)
  };

  return (
    <div className="flex flex-col items-center px-4 py-3 gap-4">
      <div className=" text-4xl">Issue Credentials here</div>
      <button
        className="px-4 py-2 bg-blue-500 rounded"
        onClick={issueCredential}
      >
        Issue
      </button>
    </div>
  );
}
