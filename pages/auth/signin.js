import Head from 'next/head'
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";
import Header from '../../components/Header';

export default function signIn({ providers }) {
  return (
    <>
      <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
        <Head>
          <title>Instagram Signin</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center">
          <img className="w-80" src="https://links.papareact.com/ocw" alt="instagram"/>
          <p className="font-xs italic">This is not real app.it is created by genius naveen kala just for learning.</p>
          <div className="mt-80">
            {Object.values(providers).map((provider) => (
              <div key={provider.id}>
                <button className="p-3 bg-blue-500 rounded-lg text-white" onClick={() => SignIntoProvider(provider.id,{callbackUrl:"/"})}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}


export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
