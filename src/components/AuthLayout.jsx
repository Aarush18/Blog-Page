import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector(state => state.auth?.status);

  useEffect(() => {
    // If authStatus is still undefined, wait until it's set.
    if (authStatus === undefined) return;

    // If the route requires authentication but the user is not authenticated, redirect to login.
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    }
    // If the route should be accessible only when the user is not authenticated,
    // but they are logged in, redirect to home.
    else if (!authentication && authStatus) {
      navigate("/", { replace: true });
    }

    setLoader(false);
  }, [authStatus, authentication, navigate]);

  // While loading the authentication status, show a loader.
  if (loader) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-center text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  // Once loading is done, render children.
  return <>{children}</>;
}
