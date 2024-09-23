export function apiResponse(
  status: number,
  message: string,
  data ?: any,
) {
  return Response.json({
      success : status < 400,
      status,
      data : data ? data : null,
      message : message || "Success",
    },
    { status }
  );
}