export const initUserLocation = (onSuccess, onError) => {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
      return;
  }

  onError(new Error("Your browser doesn't support geolocation"))
}