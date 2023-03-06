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
