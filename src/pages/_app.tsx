import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Header from "@/components/base/header/Header";
import Head from "next/head";

function MyApp({Component,pageProps}:AppProps){
    return (
        <>
            <Head>
                <meta name="viewport" content={"width=device-width, initial-scale=1"}/>
            </Head>
            <Header />
            <Component {...pageProps} />
        </>
    )
}

export default MyApp;