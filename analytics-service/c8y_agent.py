import logging
from dotenv import load_dotenv
from c8y_api.app import SimpleCumulocityApp

class C8YAgent:

    def __init__(self):
        self._logger = logging.getLogger("C8YAgent")
        self._logger.setLevel(logging.INFO)

        load_dotenv()

        # c8y
        self.c8y_client = SimpleCumulocityApp()

        # load config values from tenant options
        self.github_access_token = self.c8y_client.tenant_options.get_value(
            "github", "credentials.access_token"
        )

    def get_github_access_token(self):
        return self.github_access_token

 