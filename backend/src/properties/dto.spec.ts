import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePropertyDto, PropertyTypeDto } from "./dto";

describe("CreatePropertyDto", () => {
  const validPayload = {
    address: "123 Sathorn Road",
    bathrooms: 2,
    bedrooms: 2,
    description:
      "Bright corner unit near the station with open living space, clear building access, and practical contract details for renters.",
    images: [{ imageUrl: "https://cdn.findyourcrib.test/living.jpg" }],
    price: 42000,
    propertyType: PropertyTypeDto.CONDO,
    province: "Bangkok",
    sizeSqm: 72,
    title: "Sathorn skyline condo",
    township: "Sathorn"
  };

  it("accepts a production-ready listing payload", async () => {
    await expect(validatePayload(validPayload)).resolves.toHaveLength(0);
  });

  it("rejects thin listing details", async () => {
    const errors = await validatePayload({
      ...validPayload,
      bathrooms: 0,
      bedrooms: 0,
      description: "Too short",
      price: 0,
      sizeSqm: 0
    });

    expect(errorProperties(errors)).toEqual(expect.arrayContaining(["bathrooms", "bedrooms", "description", "price", "sizeSqm"]));
  });
});

function validatePayload(payload: Record<string, unknown>) {
  return validate(plainToInstance(CreatePropertyDto, payload));
}

function errorProperties(errors: Array<{ property: string }>) {
  return errors.map((error) => error.property);
}
