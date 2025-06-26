"use client";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/features/authSlice";
import { RootState, AppDispatch } from "../../redux/app/store";
import { useRouter } from "next/navigation";

export default function OTPComponent({ email }: { email: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { otpLoading, otpError } = useSelector(
    (state: RootState) => state.auth
  );
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    if (otpError) {
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }, [otpError]);

  const handleChange = (index: number, value: string) => {
    if (!/^[A-Za-z0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      dispatch(verifyOtp({ email, otp: otpCode })).then((res) => {
        if(res.payload === "OTP verified successfully"){
          router.push("/register/userCredentials");
      }
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <p className="text-gray-500 text-xs mt-6">Enter OTP</p>
      <div className="flex gap-2">
        {otp.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              if (el) inputRefs.current[idx] = el;
            }}
            type="text"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-10 text-center text-primaryDark text-[15px] font-bold border border-gray-300 rounded-md uppercase"
          />
        ))}
      </div>
      {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
      <button
        className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 transition disabled:bg-gray-400"
        onClick={handleVerifyOtp}
        disabled={otpLoading}
      >
        {otpLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
