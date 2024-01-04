import { LandingPageTrackerDemo } from "@/components/LandingPageTrackerDemo";
import { Button } from "@/components/ui/button";

import { DateProvider } from "@/context/DateProvider";

export default function Page() {
  return (
    <>
      <div className="text-center text-3xl md:text-5xl">
        <h1 className=" font-walsheim">
          Your radically <br />
          easy-to-use habit
          <br /> tracker
        </h1>
        <Button variant="jounral" className="my-5">
          Get Started
        </Button>
      </div>
      <div className="">
        <div className="mx-auto w-full max-w-screen-sm ">
          <DateProvider>
            <LandingPageTrackerDemo />
          </DateProvider>
        </div>
        <p className="text-center text-sm text-gray-600">
          Like what you see? Sign up now and start tracking
        </p>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="flex items-center">
      <a className="ml-auto" href="https://tally.so/r/wvMWaA" target="_blank">
        send feedback
      </a>
    </footer>
  );
}
