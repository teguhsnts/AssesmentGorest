*** Settings ***
Library    AppiumLibrary

*** Variables ***
${PLATFORM_NAME}    Android
${DEVICE_NAME}      POCO X3 NFC (Teguh)
${BROWSER_NAME}     Chrome
${DESIRED_CAPABILITIES}  platformName=${PLATFORM_NAME}  deviceName=${DEVICE_NAME}  browserName=${BROWSER_NAME}
${DEMO_URL}         https://the-internet.herokuapp.com/login

*** Test Cases ***
Login Positif
    Open Browser    ${DEMO_URL}    appium=${DESIRED_CAPABILITIES}
    Input Text      id=username    tomsmith
    Input Text      id=password    SuperSecretPassword!
    Click Element   css=[type='submit']
    Sleep    5s
    Close Browser

Login Negatif
    Open Browser    ${DEMO_URL}    appium=${DESIRED_CAPABILITIES}
    Input Text      id=username    tomsmith
    Input Text      id=password    wrong_password
    Click Element   css=[type='submit']
    Sleep    5s
    Close Browser

*** Keywords ***
Sleep
    [Arguments]    ${time}
    Sleep    ${time}