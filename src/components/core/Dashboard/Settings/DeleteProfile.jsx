import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteClick = () => {
    setConfirmationModal({
      danger: true, 
      text1: "Delete Account",
      text2:
        "This will permanently delete your account and all associated data. This action cannot be undone.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: () => handleConfirmDelete(),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteProfile(token, navigate))
      // logout + navigate is inside deleteProfil
    } catch (error) {
      console.log("ERROR MESSAGE - ", error?.message)
    } finally {
      setConfirmationModal(null)
    }
  }

  return (
    <>
     
      <div className="flex gap-4 items-start">
        {/* Icon */}
        <div
          className="
            h-10 w-10 flex items-center justify-center
            rounded-full bg-red-500/20
            text-red-300
          "
        >
          <FiTrash2 className="text-xl" />
        </div>

        {/* Text + trigger */}
        <div className="flex flex-col gap-2 text-red-200">
          <h2 className="text-sm font-semibold">Delete Account</h2>

          <p className="text-xs text-red-100/80 max-w-lg leading-relaxed">
            Permanently remove your account and all associated data. This action
            cannot be undone.
          </p>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="
              flex items-center gap-2 w-fit mt-1
              text-xs font-semibold
              text-red-300 hover:text-red-100
              underline underline-offset-4 decoration-red-400/70
            "
          >
            <FiTrash2 className="text-sm" />
            I want to delete my account
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
