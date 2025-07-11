import { AxiosError } from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Access {
  module: string;
  pages: string[];
}

export interface IUserData {
  _id?: string;
  ownerFName?: string;
  ownerLName?: string;
  interface_lang?: string[];
  email?: string;
  imageUrl?: string;
  orgName?: string;
  businessType?: string;
  orgNumber?: string;
  address?: string;
  country?: string;
  taxNumber?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  lang?: string;
  phone?: string;
  homeNumber?: string;
  type?: string;
  status?: string;
  code?: string;
  restaurantName?: string;
  cashier_balance?: number;
  isEnabled?: boolean;
  stripeConnectAcctId?: string;
  stripeConnectStatus?: string;
  stripePayoutStatus?: boolean;
  role?: string;
  access?: Access[];
  adminId?: string;
  currency?: {
    code: string;
    symbol: string;
  };
}

interface UserContextProps {
  userData: IUserData | undefined;
  loading: boolean;
  error: AxiosError | null;
  setUserData: (user: IUserData | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AxiosError | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<IUserData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  return (
    <UserContext.Provider
      value={{ userData, loading, error, setUserData, setLoading, setError }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
