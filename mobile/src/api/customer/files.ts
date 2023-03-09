// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";

type IUploadCustomerImage = {
  file: string;
};

export enum UploadDocumentType {
  Selfie = "Selfie",
  Passport = "Passport",
  IdFront = "IdFront",
  IdBack = "IdBack",
}

type IUploadOptions = {
  type: UploadDocumentType;
};

export async function uploadCustomerPhoto(
  payload: IUploadCustomerImage,
  options: IUploadOptions
): Promise<AxiosResponse<unknown, IUploadCustomerImage>> {
  const form = new FormData();
  const filename = payload.file.split("/").pop();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const match = /\.(\w+)$/.exec(filename!);
  const type = match ? `image/${match[1]}` : `image`;

  form.append(
    "File",
    // needed the parse and stringify to avoid a Typescript error
    JSON.parse(
      JSON.stringify({
        uri: payload.file,
        name: filename,
        type,
      })
    )
  );

  return paymentsApi.post(`/api/customers/files/${options.type}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mock-response-code": 201,
    },
  });
}
