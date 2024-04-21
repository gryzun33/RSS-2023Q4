export type MsgStatusRequest = {
  id: string | null;
  type: string;
  payload: {
    message: {
      id: string;
    };
  };
};

export type LoginRequest = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export type UsersRequest = {
  id: string;
  type: string;
  payload: null;
};

export type MessageRequest = {
  id: string | null;
  type: string;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
};

export type MsgEditRequest = {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
      text: string;
    };
  };
};

export type MsgDeleteRequest = {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
    };
  };
};
