import { expect, test } from "#e2e";
import { ProvidersFixture } from "#e2e/fixtures/ProvidersFixture";
import { ConsoleLogger } from "#logger/node";
import { IDGenerator } from "@goauthentik/core/id";

test.describe("Configure OAuth2 Providers", () => {
    test("Should configure a simple OAuth2 Application", async ({
        page,
        session,
        providers,
        landmarks,
    }) => {
        await session.login({
            to: ProvidersFixture.pathname,
        });

        await expect(landmarks.$wizardHeading, "Wizard is hidden by default").toBeHidden();

        await providers.$newProviderButton.click();

        await expect(
            landmarks.$wizardHeading,
            "Wizard is visible after clicking new provider",
        ).toBeVisible();

        await expect(landmarks.$wizardHeading).toHaveText("New provider");

        await expect(page.locator("ak-wizard-page-type-create")).toBeVisible();

        await expect(landmarks.$wizardNavigationNext).toBeDisabled();

        const $ouidComponent = landmarks.findOUIDComponent("oauth2provider");

        await $ouidComponent.scrollIntoViewIfNeeded();

        await $ouidComponent.click();

        await expect(landmarks.$wizardNavigationNext).toBeEnabled();

        await landmarks.$wizardNavigationNext.click();

        const $providerForm = providers.locateProviderForm("oauth2");

        await expect($providerForm).toBeVisible();
        const providerName = `New Oauth2 Provider (${IDGenerator.randomID()})`;

        const nameField = $providerForm.getByRole("textbox", {
            name: "name",
        });

        await expect(nameField).toBeVisible();

        await nameField.fill(providerName);

        await landmarks.selectSearchValue(
            $providerForm,
            "authorizationFlow",
            /default-provider-authorization-explicit-consent/,
        );

        await landmarks.$wizardNavigationNext.click();
    });
});
