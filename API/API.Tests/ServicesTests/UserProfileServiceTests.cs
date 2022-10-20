using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using API.Models;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace API.Tests.ServicesTests;

public class UserProfileServiceTests
{
    private readonly IUserProfileRepository _context;
    private readonly HttpClient _client;
    private readonly IConfiguration _configuration;
    private readonly UserProfileService _controller;

    public UserProfileServiceTests()
    {
        _context = A.Fake<IUserProfileRepository>();
        _configuration = A.Fake<IConfiguration>();
        _client = A.Fake<HttpClient>();
        _controller = new UserProfileService(_context, _configuration);
    }
    
}