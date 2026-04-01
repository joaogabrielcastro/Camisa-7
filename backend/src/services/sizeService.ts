import { sizeRepository } from "../repositories/sizeRepository";

export const sizeService = {
  list() {
    return sizeRepository.list();
  }
};
