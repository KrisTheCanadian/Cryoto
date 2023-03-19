using System.Diagnostics.CodeAnalysis;

namespace API.Models.MarketPlace;

[ExcludeFromCodeCoverage]
public class MarketPlaceItem
{
    public MarketPlaceItem(string id, string titleEn, string titleFr, string typeEn,
        string typeFr, string brand, string image, int points, int availabilities, string descriptionEn,
        string descriptionFr, string[]? size = null)
    {
        Id = id;
        Title_En = titleEn;
        Title_Fr = titleFr;
        Type_En = typeEn;
        Type_Fr = typeFr;
        Brand = brand;
        Image = image;
        Points = points;
        Availabilities = availabilities;
        Size = size;
        Description_En = descriptionEn;
        Description_Fr = descriptionFr;
    }

    public string Id { get; set; }
    public string Title_En { get; set; }
    public string Title_Fr { get; set; }
    public string Type_En { get; set; }
    public string Type_Fr { get; set; }
    public string Brand { get; set; }
    public string Image { get; set; }
    public int Points { get; set; }
    public int Availabilities { get; set; }
    public string Description_En { get; set; }
    public string Description_Fr { get; set; }
    public string[]? Size { get; set; }
}