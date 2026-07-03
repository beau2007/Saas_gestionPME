// lib/response.ts
import { NextResponse } from "next/server";

export const sendResponse = <T>(
  status: number,
  data?: T,
  message?: string,
  errors?: any
) => {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      status,
      message,
      data,
      errors,
    },
    { status }
  );
};

export const successResponse = <T>(data: T, message = "Success") => {
  return sendResponse(200, data, message);
};

export const createdResponse = <T>(data: T, message = "Created successfully") => {
  return sendResponse(201, data, message);
};

export const errorResponse = (message: string, status = 400, errors?: any) => {
  return sendResponse(status, undefined, message, errors);
};

export const unauthorizedResponse = (message = "Unauthorized") => {
  return sendResponse(401, undefined, message);
};

export const forbiddenResponse = (message = "Forbidden") => {
  return sendResponse(403, undefined, message);
};

export const notFoundResponse = (message = "Not found") => {
  return sendResponse(404, undefined, message);
};