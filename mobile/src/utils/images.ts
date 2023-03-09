// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

// We need to use this since require does not allow expressions
export enum ImageIdentifier {
  Find = "find",
  Loading = "loading",
  Ready = "ready",
}

export type ImageCollection = Record<ImageIdentifier, string>;

export const imagesCollection: ImageCollection = {
  find: require("../../assets/find.webp"),
  loading: require("../../assets/loading.png"),
  ready: require("../../assets/ready.png"),
};
