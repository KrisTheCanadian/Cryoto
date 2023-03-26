using System;
using API.Models.Users;

namespace API.Tests.Utils
{
    public class UserProfileModelBuilder
    {
        private readonly UserProfileModel _userProfile = new(
            "",
            "",
            "",
            "",
            Array.Empty<string>());

        public UserProfileModelBuilder WithId(string id)
        {
            _userProfile.OId = id;
            return this;
        }

        public UserProfileModelBuilder WithName(string name)
        {
            _userProfile.Name = name;
            return this;
        }

        public UserProfileModelBuilder WithEmail(string email)
        {
            _userProfile.Email = email;
            return this;
        }

        public UserProfileModelBuilder WithLanguage(string language)
        {
            _userProfile.Language = language;
            return this;
        }

        public UserProfileModelBuilder WithRoles(string[] roles)
        {
            _userProfile.Roles = roles;
            return this;
        }

        public UserProfileModelBuilder WithCompany(string company)
        {
            _userProfile.Company = company;
            return this;
        }

        public UserProfileModelBuilder WithSupervisoryOrganization(string supervisoryOrganization)
        {
            _userProfile.SupervisoryOrganization = supervisoryOrganization;
            return this;
        }

        public UserProfileModelBuilder WithManagerReference(string managerReference)
        {
            _userProfile.ManagerReference = managerReference;
            return this;
        }

        public UserProfileModelBuilder WithBusinessTitle(string businessTitle)
        {
            _userProfile.BusinessTitle = businessTitle;
            return this;
        }

        public UserProfileModelBuilder WithCountryReference(string countryReference)
        {
            _userProfile.CountryReference = countryReference;
            return this;
        }

        public UserProfileModelBuilder WithCountryReferenceTwoLetter(string countryReferenceTwoLetter)
        {
            _userProfile.CountryReferenceTwoLetter = countryReferenceTwoLetter;
            return this;
        }

        public UserProfileModelBuilder WithPostalCode(string postalCode)
        {
            _userProfile.PostalCode = postalCode;
            return this;
        }

        public UserProfileModelBuilder WithPrimaryWorkTelephone(string primaryWorkTelephone)
        {
            _userProfile.PrimaryWorkTelephone = primaryWorkTelephone;
            return this;
        }

        public UserProfileModelBuilder WithFax(string fax)
        {
            _userProfile.Fax = fax;
            return this;
        }

        public UserProfileModelBuilder WithMobile(string mobile)
        {
            _userProfile.Mobile = mobile;
            return this;
        }

        public UserProfileModelBuilder WithBio(string bio)
        {
            _userProfile.Bio = bio;
            return this;
        }

        public UserProfileModelBuilder WithTimeZone(string timeZone)
        {
            _userProfile.TimeZone = timeZone;
            return this;
        }

        public UserProfileModelBuilder WithStartDate(DateTime startDate)
        {
            _userProfile.StartDate = startDate;
            return this;
        }

        public UserProfileModelBuilder WithBirthday(DateTime birthday)
        {
            _userProfile.Birthday = birthday;
            return this;
        }

        public UserProfileModelBuilder WithCity(string city)
        {
            _userProfile.City = city;
            return this;
        }

        public UserProfileModelBuilder WithEmailNotifications(bool emailNotifications)
        {
            _userProfile.EmailNotifications = emailNotifications;
            return this;
        }

        public UserProfileModel Build()
        {
            return _userProfile;
        }

        public UserProfileModel BuildDefaultFakeUserProfile()
        {
            return new UserProfileModelBuilder()
                .WithId("oid1")
                .WithName("name1")
                .WithEmail("email1")
                .WithLanguage("en1")
                .WithRoles(new[] { "roles1" })
                .WithCompany("company1")
                .WithSupervisoryOrganization("supervisoryOrganization1")
                .WithManagerReference("managerReference1")
                .WithBusinessTitle("business")
                .WithCountryReference("countryReference1")
                .WithCountryReferenceTwoLetter("countryReferenceTwoLetter1")
                .WithPostalCode("postalCode1")
                .WithPrimaryWorkTelephone("primaryWorkTelephone1")
                .WithFax("fax1")
                .WithMobile("mobile1")
                .WithBio("bio1")
                .WithTimeZone("timeZone1")
                .WithStartDate(DateTime.Now)
                .WithBirthday(DateTime.Now)
                .WithCity("city1")
                .WithEmailNotifications(true)
                .Build();
        }
    }
}
        
