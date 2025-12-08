import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { BuyCourse } from "../../../../services/operations/StudentFeatureAPI";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    BuyCourse(token, courses, user, navigate, dispatch);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Label + amount */}
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-pure-greys-100">
          Total Amount
        </p>

        <p
          className="
            text-3xl font-bold
            bg-clip-text text-transparent
            bg-gradient-to-r
            from-caribbeangreen-100 via-neon-100 to-yellow-50
          "
        >
          ₹ {total}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-glass-200 rounded-full" />

      {/* Button */}
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="
          w-full justify-center
          !bg-caribbeangreen-100 !text-black
          hover:!bg-caribbeangreen-50
          shadow-[0_8px_24px_rgba(6,214,160,0.35)]
          text-sm font-semibold
        "
      />
    </div>
  );
};

export default RenderTotalAmount;
