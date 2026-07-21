from enum import StrEnum


class Environment(StrEnum):
    LOCAL = "local"
    STAGING = "staging"
    PRODUCTION = "production"


class LeadStatus(StrEnum):
    NEW = "new"
    PROCESSED = "processed"
    SPAM = "spam"
