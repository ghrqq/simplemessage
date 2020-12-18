const errorHandler = (type, res) => {
  if (type === "impostor") {
    res
      .status(400)
      .send({
        message:
          "Something is wrong with your token or cookie. This might be because you are tampered with one of them. If you think there is a mistake, clear your cookies and try again.",
      });
  }

  if (type === "blocked") {
    res
      .status(400)
      .send({
        message:
          "The information provided by your browser do not match with our records. Therefore, your account is blocked. If you think there is a mistake, clear your cookies and try again.",
      });
  }
  if (type === "expired") {
    res
      .status(400)
      .send({ message: "Your code is expired. Please start again." });
  }
};

// Error messages types and keys:
