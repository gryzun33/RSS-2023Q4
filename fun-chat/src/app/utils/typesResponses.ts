export type DeliveredResponse = {
  id: string;
  status: {
    isDelivered: boolean;
  };
};

export type ReadedResponse = {
  id: string;
  status: {
    isReaded: boolean;
  };
};

export type EditResponse = {
  id: string;
  text: string;
  status: {
    isEdited: boolean;
  };
};

export type DeleteResponse = {
  id: string;
  status: {
    isDeleted: boolean;
  };
};

export type UserResponse = {
  login: string;
  isLogined: boolean;
};

export type MessageResponse = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};
