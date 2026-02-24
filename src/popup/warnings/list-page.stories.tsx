import type { Meta, StoryObj } from "@storybook/react-webpack5";
import ListPage from "./list-page";
import { mocked } from "storybook/test";
import browser from "webextension-polyfill";
import { AllData } from "../../schema";

const meta = {
  component: ListPage,
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(true);
  },
} satisfies Meta<typeof ListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [],
    } satisfies AllData);
  },
};

export const TopBanner: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "topBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const TopBannerDisabled: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "topBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const BottomBanner: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "bottomBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const BottomBannerDisabled: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "bottomBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const Border: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "border",
          enabled: true,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
      ],
    } satisfies AllData);
  },
};

export const BorderDisabled: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "border",
          enabled: false,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
      ],
    } satisfies AllData);
  },
};

export const AllCombined: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus1",
          warningStyle: "topBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus2",
          warningStyle: "topBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus3",
          warningStyle: "bottomBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus4",
          warningStyle: "bottomBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus5",
          warningStyle: "border",
          enabled: true,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
        {
          id: "bogus6",
          warningStyle: "border",
          enabled: false,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
      ],
    } satisfies AllData);
  },
};

export const ErrorState: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockRejectedValue(
      new Error("Mock error"),
    );
  },
};
