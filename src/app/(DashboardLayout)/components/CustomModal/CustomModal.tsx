import styled from "@emotion/styled"
import { Box, Button, Modal } from "@mui/material"

const ButtonWrapper = styled("div")(() => ({
  marginTop: "40px",
  textAlign: "center",
}))

const CustomModal = ({
  modalState,
  setModalState,
  modalWidth,
  altBtnText,
  altBtnFn,
  children,
}: any) => {
  return modalState ? (
    <Modal
      keepMounted
      open={modalState}
      onClose={() => setModalState(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: modalWidth ? modalWidth : "400px",
          height: "auto",
          bgcolor: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>{children}</Box>
        <ButtonWrapper>
          {altBtnText ? (
            <>
              <Button
                color="primary"
                variant="contained"
                size="small"
                sx={{ marginRight: "10px" }}
                onClick={altBtnFn}
              >
                {altBtnText}
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => setModalState(false)}
              >
                Close
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => setModalState(false)}
            >
              Close
            </Button>
          )}
        </ButtonWrapper>
      </Box>
    </Modal>
  ) : null
}

export default CustomModal
