import { v4 } from "uuid"

export class IdGeneratorAdapter {
  async execute() {
    return v4()
  }
}
